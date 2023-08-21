interface dataTypes {
  name: string
  sex: boolean
  age: number
}
class Person {
  public name: string
  protected sex: boolean
  protected age: number
  constructor(data: dataTypes) {
    this.name = data.name
    this.sex = data.sex
    this.age = data.age
    // function run(aa: any) {
    //   console.log('aa', aa)
    // }
    console.log('data', data)
  }
}
class songPerson extends Person {
  public animate: string
  constructor(data: any) {
    super(data)
    this.animate = data.animate
  }
}
let data = {
  name: 'zhangyuhang',
  sex: true,
  age: 18,
  animate: 'animate'
}
let person = new songPerson(data)
console.log('person', person)

interface battery {
  checkBatteryStatus(): void
}
