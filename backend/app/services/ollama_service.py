import requests


class OllamaService:

    def __init__(self):
        self.base_url = "http://localhost:11434"
        self.url = f"{self.base_url}/api/generate"
        self.model = "qwen3:8b"
        self.timeout = 120

    def generate(self, prompt: str) -> str:

        payload = {
    "model": self.model,
    "prompt": prompt,
    "stream": False,
    "think": False
}

        try:

            response = requests.post(
                self.url,
                json=payload,
                timeout=self.timeout,
            )

            response.raise_for_status()

            data = response.json()

            return data.get("response", "").strip()

        except requests.exceptions.Timeout as e:
            raise RuntimeError(
                "Request timed out while communicating with Ollama."
            ) from e

        except requests.exceptions.ConnectionError as e:
            raise RuntimeError(
                "Unable to connect to Ollama. Make sure Ollama is running."
            ) from e

        except requests.exceptions.HTTPError as e:
            raise RuntimeError(
                f"Ollama HTTP Error: {response.text}"
            ) from e

        except Exception as e:
            raise RuntimeError(
                f"Unexpected Error: {str(e)}"
            ) from e

    def health(self):

        try:

            response = requests.get(
                f"{self.base_url}/api/tags",
                timeout=10,
            )

            if response.status_code == 200:

                models = response.json().get("models", [])

                return {
                    "status": "online",
                    "model": self.model,
                    "available_models": [
                        m.get("name") for m in models
                    ],
                }

            return {
                "status": "offline",
            }

        except Exception:

            return {
                "status": "offline",
            }