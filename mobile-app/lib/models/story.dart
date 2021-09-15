import 'package:json_annotation/json_annotation.dart';

part 'story.g.dart';

@JsonSerializable()
class Story {
  @JsonKey(required: true)
  final String link;

  @JsonKey(required: true)
  final String pubDate;

  @JsonKey(required: true)
  final String title;

  @JsonKey(required: true)
  final String author;

  @JsonKey(required: true)
  final String guid;

  @JsonKey(required: true)
  final String thumbnail;

  // @JsonKey(required: true)
  // final String  content;

  Story(this.link, this.pubDate, this.title, this.author, this.guid,
      this.thumbnail);

  factory Story.fromJson(Map<String, dynamic> json) => _$StoryFromJson(json);

  Map<String, dynamic> toJson() => _$StoryToJson(this);

  static String createTableStmt() =>
      'CREATE TABLE IF NOT EXISTS ${storyDbName()}('
      '${dbGuid()} TEXT PRIMARY KEY, '
      '${dbTitle()} TEXT, '
      '${dbAuthor()} TEXT, '
      '${dbThumbnail()} TEXT, '
      '${dbLink()} TEXT, '
      '${dbPubDate()} TEXT )';

  static String dbAuthor() => 'author';

  static String dbContent() => 'content';

  static String dbGuid() => 'guid';

  static String dbLink() => 'link';

  static String dbPubDate() => 'pubDate';

  static String dbThumbnail() => 'thumbnail';

  static String dbTitle() => 'title';

  static String dropTableStmt() => 'DROP TABLE IF EXISTS ${storyDbName()}';

  static List<Story> parseStories(dynamic jsonBody) {
    var stories = <Story>[];

    var jsonArray = jsonBody['items'];
    for (var jsonElement in jsonArray) {
      try {
        var story = Story.fromJson(jsonElement);
        stories.add(story);
      } catch (e) {
        print('Error parsing stories : $e');
      }
    }

    // stories.sort((storyA, storyB) {
    //   return storyA.getName().compareTo(storyB.getName().toLowerCase());
    // });

    return stories;
  }

  static String storyDbName() => 'stories_table';
}

extension ParseSite on Story {
  String getPubDate() {
    try {
      var date = pubDate.split(' ').first;
      return date;
    } catch (e) {
      print(e);
    }
    return pubDate;
  }
}
