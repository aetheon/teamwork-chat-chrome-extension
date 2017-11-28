let gotAuthKey
let gotUserId
let gotInstallationId
let gotClientVersion
let gotInstallationDomain
let chatWebSocket = null

chrome.runtime.onStartup.addListener(function () {
  chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
    if (cookie != null) {
      startUp()
    }
  })
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.cookies.get({url: 'https://www.teamwork.com', name: 'userInstallation'}, function (cookie) {
    if (cookie != null) {
      startUp()
    }
    else {
    changeIconOnError()
    }
  })
})
chrome.browserAction.onClicked.addListener(function () {
  if (userInstallation != null) {
    let newURL = userInstallation + '.teamwork.com/chat'
    chrome.tabs.create({ url: newURL })
    rotateIcon()
  } else {
    chrome.tabs.create({ url: 'https://teamwork.com/chat' })
    
  }
})

chrome.webNavigation.onHistoryStateUpdated.addListener(function (e) {
  if (chatWebSocket === null) {
    startUp()
  } else if (!(chatWebSocket.readyState === 0 || chatWebSocket.readyState === 1)) {
    startUp()
  }
}, {url: [{urlContains: '.teamwork.com/chat/people'}, {urlContains: '.teamwork.com/chat/rooms'}]})

window.addEventListener('offline', function () {
  closeWebSocket()
  updateBadgeCount('?')
}, false)
window.addEventListener('online', function () {
  checkWebSocketOpened()
}, false)
