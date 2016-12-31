package sample

class Author {
  String name
  Integer age
  String email

  String toString() {
    name
  }

  static constraints = {
    email email:true, widget:'textarea'
    name nullable: true
    age nullable: true
  }
}
