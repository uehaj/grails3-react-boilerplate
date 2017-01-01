package sample

class Author {
  String name
  Integer age
  String email

  static hasMany = [schedules: Schedule]

  String toString() {
    name
  }

  static constraints = {
    email email:true, widget:'textarea'
    name nullable: true
    age nullable: true
  }
}
