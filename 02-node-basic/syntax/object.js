var member = ["a", "b", "c"]
console.log(member[1]) // b

var roles = {
  programmer: "ian",
  designer: "kim",
}
console.log(roles.programmer) // ian

// array, object
var i = function f1() {
  console.log(1 + 1)
  console.log(1 + 2)
}

var i1 = function () {
  console.log(1 + 1)
  console.log(1 + 2)
}

// occur error
// var y = if (true) {
//   console.log(1)
// }

var a = [i]
a[0]()

var o = {
  func: i,
}
o.func()

var v1 = "v1"
// 1m codes between v1 and v2
var v2 = "v2"

var p = {
  v1: "v1",
  v2: "v2",
  f1: function () {
    onsole.log(this.v1) // self
  },
  f2: function () {
    console.log(this.v2)
  },
}
