// 时间格式转化
const renderTime = () => {
  var date = new Date().toJSON();
  return new Date(+new Date(date) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
}

export default renderTime