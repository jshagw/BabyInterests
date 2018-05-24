
var babyInfo = {
  hasBaby: false,
  id: '',
  name: '我的宝宝',
  sex: 1,
  birthday: "2013-04-15",
  relation: 2,
  is_creator: 1
}

var get = function() {
  return babyInfo
}

var set = function(info) {
  //console.log(info)
  for (var key in info) {
    if (info.hasOwnProperty(key)) {
      babyInfo[key] = info[key]
    }
  }

  if (info.hasOwnProperty('id')) {
    babyInfo.hasBaby = true
  }
  //console.log(babyInfo)
}

module.exports = {
  get: get,
  set: set
}
