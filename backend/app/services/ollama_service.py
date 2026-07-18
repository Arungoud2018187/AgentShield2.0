import requests


class OllamaService:
    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "qwen3:8b"

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        try:
            response = requests.post(self.url, json=payload, timeout=120)

            if response.status_code != 200:
                return f"Ollama Error: {response.text}"

            data = response.json()
            return data.get("response", "")

        except requests.exceptions.RequestException as e:
            return f"Connection Error: {str(e)}"