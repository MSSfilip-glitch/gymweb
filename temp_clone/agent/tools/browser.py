import httpx
from bs4 import BeautifulSoup

class BrowserTool:
    """Lightweight web research: fetch pages and search DuckDuckGo.

    Phase 1 uses simple HTTP fetching (httpx + BeautifulSoup).
    Playwright-based full browser automation is deferred to Phase 2.
    """

    def __init__(self, timeout=15, max_content_length=8000):
        self.timeout = timeout
        self.max_content_length = max_content_length
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        }

    def browse_url(self, url):
        """Fetch a URL and return its text content (HTML stripped)."""
        try:
            with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
                response = client.get(url, headers=self.headers)
                response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")

            # Remove script, style, nav, footer elements
            for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
                tag.decompose()

            text = soup.get_text(separator="\n", strip=True)

            # Truncate to max length
            if len(text) > self.max_content_length:
                text = text[: self.max_content_length] + "\n\n[... content truncated ...]"

            return {
                "url": url,
                "title": soup.title.string if soup.title else "",
                "content": text,
            }
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP {e.response.status_code}: {str(e)}"}
        except Exception as e:
            return {"error": str(e)}

    def search_web(self, query, num_results=5):
        """Search DuckDuckGo HTML and return top results."""
        try:
            search_url = "https://html.duckduckgo.com/html/"
            with httpx.Client(timeout=self.timeout, follow_redirects=True) as client:
                response = client.post(
                    search_url,
                    data={"q": query},
                    headers=self.headers,
                )
                response.raise_for_status()

            soup = BeautifulSoup(response.text, "html.parser")
            results = []

            for result_div in soup.select(".result")[:num_results]:
                title_tag = result_div.select_one(".result__title a")
                snippet_tag = result_div.select_one(".result__snippet")

                if title_tag:
                    results.append({
                        "title": title_tag.get_text(strip=True),
                        "url": title_tag.get("href", ""),
                        "snippet": snippet_tag.get_text(strip=True) if snippet_tag else "",
                    })

            return {"query": query, "results": results}
        except Exception as e:
            return {"error": str(e)}
