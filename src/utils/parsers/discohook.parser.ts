/**
 * Utility class for parsing discohook urls and embeds
 */
export class DiscohookParser {
  /**
   * WARNING: Supports only share.discohook.app urls!
   */
  async parseEmbed(url: string) {
    try {
      const response = await fetch(url);
      const endUrl = response.url;

      let base;

      if (endUrl.includes("https://share.discohook.app/go/")) {
        const jsonResponse = await response.json();
        base = jsonResponse.data;
      } else {
        throw Error("Url must include /share.discohook.app/")
      }

      if (base) {
        const decoded = Buffer.from(base, "base64").toString("utf-8");
        const json = JSON.parse(decoded);
        return json;
      }
      return null;
    } catch {
      return null;
    }
  }
}
