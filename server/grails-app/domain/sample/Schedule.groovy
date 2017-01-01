package sample

class Schedule {
  Date date
  String name

  static belongsTo = [author: Author]
}
