const menus = [
  ["twitterで検索", "selection"],
  ["YouTubeで検索", "selection"],
  ["twitterでtweetを検索", "link"],
];

chrome.runtime.onInstalled.addListener(handlerInstalled);

function handlerInstalled() {
  for (let index = 0; index < menus.length; index++) {
    [title, context] = menus[index];
    chrome.contextMenus.create({
      id: `menu_${index}`,
      title: title,
      contexts: [context]
    });
  }

  return;
}

chrome.contextMenus.onClicked.addListener(handlerClick);

function handlerClick(item, tab) {
  switch (item.menuItemId) {
    case 'menu_0': {
      const url = new URL(`https://x.com/search?src=typed_query&f=live`);
      url.searchParams.set('q', `"${item.selectionText}"`);
      chrome.tabs.create({ url: url.href, index: tab.index + 1 });
      break;
    }
    case 'menu_1': {
      const url = new URL(`https://www.youtube.com/results`);
      url.searchParams.set('search_query', `"${item.selectionText}"`);
      chrome.tabs.create({ url: url.href, index: tab.index + 1 });
      break;
    }
    case 'menu_2': {
      if (!item.linkUrl.startsWith("https://x.com/")) {
        break;
      }

      let tmp = item.linkUrl.split("/");
      const url = new URL(`https://x.com/search?src=typed_query&f=live`);
      url.searchParams.set('q', `from:${tmp[3]}`);
      chrome.tabs.create({ url: url.href, index: tab.index + 1 });
      break;
    }
    default:
      break;
  }

  return;
}
