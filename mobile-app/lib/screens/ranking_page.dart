import 'package:app/constants/app_constants.dart';
import 'package:app/models/measurement.dart';
import 'package:app/models/story.dart';
import 'package:app/screens/place_details.dart';
import 'package:app/services/local_storage.dart';
import 'package:app/services/rest_api.dart';
import 'package:app/utils/pm.dart';
import 'package:app/utils/share.dart';
import 'package:flutter/material.dart';

class RankingPage extends StatefulWidget {
  @override
  _RankingPageState createState() => _RankingPageState();
}

class _RankingPageState extends State<RankingPage> {
  var stories = <Story>[];
  var measurements = <Measurement>[];
  var order = 1;
  var pollutant = 'pm2.5';
  String dropdownValue = 'Best';

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: rankingWidget(),
    );
  }

  void getRankings() {
    DBHelper().getLatestMeasurements().then((value) => {
          if (mounted) {setRankings(value)}
        });

    AirqoApiClient(context).fetchLatestMeasurements().then((value) => {
          if (mounted) {setRankings(value)},
          DBHelper().insertLatestMeasurements(value)
        });
  }

  void initialize() {
    getRankings();
  }

  @override
  void initState() {
    super.initState();
    initialize();
  }

  Widget rankingWidget() {
    if (measurements.isEmpty) {
      return Container(
        color: Colors.white,
        child: Center(
          child: CircularProgressIndicator(
            color: ColorConstants.appColor,
          ),
        ),
      );
    } else {
      return Container(
          color: Colors.white,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(10, 5, 10, 0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    OutlinedButton(
                      onPressed: () {
                        setPollutant('pm2.5');
                      },
                      style: OutlinedButton.styleFrom(
                        backgroundColor: pollutant == 'pm2.5'
                            ? ColorConstants.appColor
                            : Colors.white,
                      ),
                      child: RichText(
                          text: TextSpan(
                        style: DefaultTextStyle.of(context).style,
                        children: <TextSpan>[
                          TextSpan(
                            text: 'PM',
                            style: TextStyle(
                                color: pollutant == 'pm2.5'
                                    ? Colors.white
                                    : ColorConstants.appColor),
                          ),
                          TextSpan(
                            text: '2.5',
                            style: TextStyle(
                                fontSize: 10,
                                color: pollutant == 'pm2.5'
                                    ? Colors.white
                                    : ColorConstants.appColor),
                          )
                        ],
                      )),
                    ),
                    const SizedBox(
                      width: 10,
                    ),
                    OutlinedButton(
                      onPressed: () {
                        setPollutant('pm10');
                      },
                      style: OutlinedButton.styleFrom(
                        backgroundColor: pollutant == 'pm10'
                            ? ColorConstants.appColor
                            : Colors.white,
                      ),
                      child: RichText(
                          text: TextSpan(
                        style: DefaultTextStyle.of(context).style,
                        children: <TextSpan>[
                          TextSpan(
                            text: 'PM',
                            style: TextStyle(
                                color: pollutant == 'pm10'
                                    ? Colors.white
                                    : ColorConstants.appColor),
                          ),
                          TextSpan(
                            text: '10',
                            style: TextStyle(
                                fontSize: 10,
                                color: pollutant == 'pm10'
                                    ? Colors.white
                                    : ColorConstants.appColor),
                          )
                        ],
                      )),
                    ),
                    const Spacer(),
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(150),
                      ),
                      child: IconButton(
                        onPressed: () {
                          shareRanking(measurements);
                        },
                        icon: Icon(Icons.share_outlined,
                            color: ColorConstants.appColor),
                      ),
                    ),
                    Card(
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.only(left: 5, right: 5),
                          child: DropdownButton<String>(
                            value: dropdownValue,
                            icon: Icon(Icons.arrow_drop_down,
                                color: dropdownValue == 'Best'
                                    ? ColorConstants.green
                                    : ColorConstants.red),
                            iconSize: 24,
                            elevation: 16,
                            style: TextStyle(color: ColorConstants.appColor),
                            underline: Container(
                                height: 2,
                                color: dropdownValue == 'Best'
                                    ? ColorConstants.green
                                    : ColorConstants.red),
                            onChanged: (String? newValue) {
                              setState(() {
                                dropdownValue = newValue!;
                                setState(() {
                                  order = -order;
                                });
                                setRankings(measurements);
                              });
                            },
                            items: <String>['Best', 'Worst']
                                .map<DropdownMenuItem<String>>((String value) {
                              return DropdownMenuItem<String>(
                                  value: value,
                                  child: Padding(
                                    padding: EdgeInsets.all(2),
                                    child: Text(value),
                                  ));
                            }).toList(),
                          ),
                        )),
                  ],
                ),
              ),
              Divider(
                indent: 10,
                endIndent: 10,
                color: ColorConstants.appColor,
              ),
              Expanded(
                child: RefreshIndicator(
                    onRefresh: refresh,
                    child: ListView.builder(
                      itemBuilder: (context, index) => GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                              MaterialPageRoute(builder: (context) {
                            return PlaceDetailsPage(
                                measurement: measurements[index]);
                          }));
                        },
                        child: ListTile(
                          trailing: ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                                width: 70,
                                height: 40,
                                color: pollutant == 'pm2.5'
                                    ? pm2_5ToColor(
                                        measurements[index].getPm2_5Value())
                                    : pm10ToColor(
                                        measurements[index].getPm10Value()),
                                padding: const EdgeInsets.all(5),
                                child: Center(
                                  child: pollutant == 'pm2.5'
                                      ? Text(
                                          '${measurements[index].getPm2_5Value()}',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                              color: pm2_5TextColor(
                                                  measurements[index]
                                                      .getPm2_5Value())),
                                        )
                                      : Text(
                                          '${measurements[index].getPm10Value()}',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                              color: pm10TextColor(
                                                  measurements[index]
                                                      .getPm10Value())),
                                        ),
                                )),
                          ),
                          title: Text('${measurements[index].site.getName()}',
                              overflow: TextOverflow.ellipsis,
                              maxLines: 3,
                              style: TextStyle(
                                fontSize: 15,
                                color: ColorConstants.appColor,
                                fontWeight: FontWeight.bold,
                              )),
                          subtitle:
                              Text('${measurements[index].site.getLocation()}',
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: ColorConstants.appColor,
                                  )),
                        ),
                      ),
                      itemCount: measurements.length,
                    )),
              ),
            ],
          ));
    }
  }

  Future<void> refresh() async {
    await AirqoApiClient(context).fetchLatestStories().then((value) => {
          if (mounted)
            {
              setState(() {
                stories = value;
              })
            },
          DBHelper().insertLatestStories(value),
        });

    await AirqoApiClient(context).fetchLatestMeasurements().then((value) => {
          if (mounted) {setRankings(value)},
          DBHelper().insertLatestMeasurements(value)
        });
  }

  void setPollutant(String value) {
    setState(() {
      pollutant = value;
    });
    setRankings(measurements);
  }

  void setRankings(List<Measurement> values) {
    if (order == -1) {
      if (pollutant == 'pm2.5') {
        values.sort((valueA, valueB) =>
            -(valueA.getPm2_5Value().compareTo(valueB.getPm2_5Value())));
      } else {
        values.sort((valueA, valueB) =>
            -(valueA.getPm10Value().compareTo(valueB.getPm10Value())));
      }
    } else {
      if (pollutant == 'pm2.5') {
        values.sort((valueA, valueB) =>
            valueA.getPm2_5Value().compareTo(valueB.getPm2_5Value()));
      } else {
        values.sort((valueA, valueB) =>
            valueA.getPm10Value().compareTo(valueB.getPm10Value()));
      }
    }

    setState(() {
      measurements = values;
    });
  }
}