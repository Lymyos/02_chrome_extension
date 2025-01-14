function addCustomButtons() {
  // YouTubeの動画リストを取得
  const videos = document.querySelectorAll("ytd-video-renderer, ytd-rich-item-renderer");

  videos.forEach((video) => {
    // カスタムボタンが既に存在している場合はスキップ
    if (video.querySelector(".custom-hide-button")) return;

    // ボタン要素を作成
    const hideButton = document.createElement("button");
    hideButton.className = "custom-hide-button";

    // アイコン要素を作成
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("hide_channel.png"); // 拡張機能内の画像ファイルへの正しいパス
    icon.alt = "Hide";
    icon.className = "custom-hide-icon";

    // ボタンにアイコンを追加
    hideButton.appendChild(icon);

    // ボタンのクリックイベントを設定
    hideButton.addEventListener("click", () => {
      const menuButton = video.querySelector("#button[aria-label*='操作']");
      if (menuButton) {
        menuButton.click();
        setTimeout(() => {
          const hideOption = Array.from(document.querySelectorAll("yt-formatted-string"))
            .find((el) => el.innerText.includes("チャンネルをおすすめに表示しない"));
          if (hideOption) {
            hideOption.click();
          } else {
            alert("オプションが見つかりませんでした");
          }
        }, 500);
      }
    });

    // ボタンをチャンネル名の横に配置
    const channelInfo = video.querySelector("#channel-name");
    if (channelInfo) {
      const container = document.createElement("div");
      container.style.display = "inline-flex";
      container.style.alignItems = "center";
      container.style.marginLeft = "10px"; // チャンネル名との間隔
      container.appendChild(hideButton);
      channelInfo.appendChild(container);
    }
  });
}

// DOMの変更を監視し、新しい動画が追加された場合に対応
const observer = new MutationObserver(() => {
  addCustomButtons();
});

observer.observe(document.body, { childList: true, subtree: true });

// 初期ロード時にボタンを追加
addCustomButtons();

console.log("Image URL:", chrome.runtime.getURL("hide_channel.png"));
