package sample

class Author {
  String name
  Integer age
  String email

  static constraints = {
    email email:true
    name nullable: true
    email nullable: true
    age nullable: true
  }
}
