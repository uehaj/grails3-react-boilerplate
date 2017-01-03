package sample

class Author {
  String name
  Integer age
  String email
  Schedule todaySchedule;

  static hasMany = [schedules: Schedule]

  String toString() {
    name
  }

  static constraints = {
    email email:true, widget:'textarea'
    name nullable: true
    age nullable: true
    todaySchedule nullable: true
  }
}
