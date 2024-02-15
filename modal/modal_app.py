from modal import Image, Stub, method, NetworkFileSystem, asgi_app
from fastapi import Request, FastAPI
import tempfile
import time

MODEL_DIR = "/model"

web_app = FastAPI()

def download_model():
    from huggingface_hub import snapshot_download
    snapshot_download("openai/whisper-large-v3", local_dir=MODEL_DIR)


image = (
    Image.from_registry("nvidia/cuda:12.2.0-devel-ubuntu22.04", add_python="3.11")
    .apt_install("git","ffmpeg")
    .pip_install(
        "transformers",
        "ninja",
        "packaging",
        "wheel",
         "torch",
        "hf-transfer~=0.1",
        "ffmpeg-python",
    ).run_commands("python -m pip install flash-attn --no-build-isolation", gpu="A10G")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
    .run_function(
        download_model,
    )
)

stub = Stub("whisper-v3-demo", image=image)
stub.net_file_system = NetworkFileSystem.new()

@stub.cls(
    gpu="A10G",
    allow_concurrent_inputs=80,
    container_idle_timeout=40,
    network_file_systems={"/audio_files": stub.net_file_system},
)
class WhisperV3:
    def __enter__(self):
        import torch
        from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            MODEL_DIR,
            torch_dtype=self.torch_dtype,
            use_safetensors=True,
            use_flash_attention_2=True,
        )
        processor = AutoProcessor.from_pretrained(MODEL_DIR)
        model.to(self.device)
        self.pipe = pipeline(
            "automatic-speech-recognition",
            model=model,
            tokenizer=processor.tokenizer,
            feature_extractor=processor.feature_extractor,
            max_new_tokens=128,
            chunk_length_s=30,
            batch_size=24,
            return_timestamps=True,
            torch_dtype=self.torch_dtype,
            model_kwargs={"use_flash_attention_2": True},
            device=0,
        )

    @method()
    def generate(self, audio: bytes):
        fp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        fp.write(audio)
        fp.close()
        start = time.time()
        output = self.pipe(
            fp.name, chunk_length_s=30, batch_size=24, return_timestamps=True
        )
        elapsed = time.time() - start
        return output, elapsed

@stub.function()
@web_app.post("/")
async def transcribe(request: Request):
    form = await request.form()
    audio = await form["audio"].read()
    output, elapsed= WhisperV3().generate.remote(audio)
    return output, elapsed

@stub.function()
@asgi_app()
def entrypoint():
    return web_app
