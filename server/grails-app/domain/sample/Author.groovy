package sample

class Author {
  String name
  Integer age
  String email

  static constraints = {
    email email:true, widget:'textarea'
    name nullable: true
    age nullable: true
  }
}
