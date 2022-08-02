import defaultSettings from '@/settings'

const title = defaultSettings.title || '车联网用户信息安全系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
