import 'dart:ui';

import 'package:app/constants/app_constants.dart';
import 'package:app/models/pollutant.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:charts_flutter/flutter.dart' as charts;

charts.Color pmToChartColor(double pm2_5) {
  if (pm2_5 >= 0 && pm2_5 <= 12) {
    //good
    return charts.ColorUtil.fromDartColor(greenColor);
  } else if (pm2_5 >= 12.1 && pm2_5 <= 35.4) {
    //moderate
    return charts.ColorUtil.fromDartColor(yellowColor);
  } else if (pm2_5 >= 35.5 && pm2_5 <= 55.4) {
    //sensitive
    return charts.ColorUtil.fromDartColor(orangeColor);
  } else if (pm2_5 >= 55.5 && pm2_5 <= 150.4) {
    // unhealthy
    return charts.ColorUtil.fromDartColor(redColor);
  } else if (pm2_5 >= 150.5 && pm2_5 <= 250.4) {
    // very unhealthy
    return charts.ColorUtil.fromDartColor(purpleColor);
  } else if (pm2_5 >= 250.5) {
    // hazardous
    return charts.ColorUtil.fromDartColor(maroonColor);
  } else {
    return charts.ColorUtil.fromDartColor(appColor);
  }
}

Color pmToColor(double pm2_5) {
  if (pm2_5 >= 0 && pm2_5 <= 12) {
    //good
    return greenColor;
  } else if (pm2_5 >= 12.1 && pm2_5 <= 35.4) {
    //moderate
    return yellowColor;
  } else if (pm2_5 >= 35.5 && pm2_5 <= 55.4) {
    //sensitive
    return orangeColor;
  } else if (pm2_5 >= 55.5 && pm2_5 <= 150.4) {
    // unhealthy
    return redColor;
  } else if (pm2_5 >= 150.5 && pm2_5 <= 250.4) {
    // very unhealthy
    return purpleColor;
  } else if (pm2_5 >= 250.5) {
    // hazardous
    return maroonColor;
  } else {
    return appColor;
  }
}

String pmToString(double pm2_5) {
  if (pm2_5 >= 0 && pm2_5 <= 12) {
    //good
    return 'Good';
  } else if (pm2_5 >= 12.1 && pm2_5 <= 35.4) {
    //moderate
    return 'Moderate';
  } else if (pm2_5 >= 35.5 && pm2_5 <= 55.4) {
    //sensitive
    return 'Unhealthy for\nsensitive people';
  } else if (pm2_5 >= 55.5 && pm2_5 <= 150.4) {
    // unhealthy
    return 'Unhealthy';
  } else if (pm2_5 >= 150.5 && pm2_5 <= 250.4) {
    // very unhealthy
    return 'Very Unhealthy';
  } else if (pm2_5 >= 250.5) {
    // hazardous
    return 'Hazardous';
  } else {
    return '';
  }
}

String pmToImage(double pm2_5) {
  if (pm2_5 >= 0 && pm2_5 <= 12) {
    //good
    return 'assets/images/good.png';
  } else if (pm2_5 >= 12.1 && pm2_5 <= 35.4) {
    //moderate
    return 'assets/images/moderate.png';
  } else if (pm2_5 >= 35.5 && pm2_5 <= 55.4) {
    //sensitive
    return 'assets/images/sensitive.png';
  } else if (pm2_5 >= 55.5 && pm2_5 <= 150.4) {
    // unhealthy
    return 'assets/images/unhealthy.png';
  } else if (pm2_5 >= 150.5 && pm2_5 <= 250.4) {
    // very unhealthy
    return 'assets/images/veryUnhealthy.png';
  } else if (pm2_5 >= 250.5) {
    // hazardous
    return 'assets/images/hazardous.png';
  } else {
    return 'assets/images/pmDefault.png';
  }
}

String pmToEmoji(double pm2_5) {
  if (pm2_5 >= 0 && pm2_5 <= 12) {
    //good
    return 'assets/images/good-face.png';
  } else if (pm2_5 >= 12.1 && pm2_5 <= 35.4) {
    //moderate
    return 'assets/images/moderate-face.png';
  } else if (pm2_5 >= 35.5 && pm2_5 <= 55.4) {
    //sensitive
    return 'assets/images/sensitive-face.png';
  } else if (pm2_5 >= 55.5 && pm2_5 <= 150.4) {
    // unhealthy
    return 'assets/images/unhealthy-face.png';
  } else if (pm2_5 >= 150.5 && pm2_5 <= 250.4) {
    // very unhealthy
    return 'assets/images/very-unhealthy-face.png';
  } else if (pm2_5 >= 250.5) {
    // hazardous
    return 'assets/images/hazardous-face.png';
  } else {
    return 'assets/images/good-face.png';
  }
}

BitmapDescriptor pmToMarkerPoint(double pm2_5) {
  if (pm2_5 >= 0 && pm2_5 <= 12) {
    //good
    return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueGreen);
  } else if (pm2_5 >= 12.1 && pm2_5 <= 35.4) {
    //moderate
    return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueYellow);
  } else if (pm2_5 >= 35.5 && pm2_5 <= 55.4) {
    //sensitive
    return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange);
  } else if (pm2_5 >= 55.5 && pm2_5 <= 150.4) {
    // unhealthy
    return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed);
  } else if (pm2_5 >= 150.5 && pm2_5 <= 250.4) {
    // very unhealthy
    return BitmapDescriptor.defaultMarkerWithHue(285);
  } else if (pm2_5 >= 250.5) {
    // hazardous
    return BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueMagenta);
  } else {
    return BitmapDescriptor.defaultMarker;
  }
}

String pollutantToString(String pollutantConstant) {
  pollutantConstant = pollutantConstant.trim();

  if (pollutantConstant == PollutantConstants.pm2_5) {
    return 'PM 2.5';
  } else if (pollutantConstant == PollutantConstants.pm10) {
    return 'PM 10';
  } else {
    return '';
  }
}

Pollutant pollutantDetails(String pollutantConstant) {
  pollutantConstant = pollutantConstant.trim();

  if (pollutantConstant == PollutantConstants.pm2_5.trim()) {
    return Pollutant(
        pollutantToString(PollutantConstants.pm2_5),
        PollutantDescription.pm2_5,
        PollutantSource.pm2_5,
        PollutantEffects.pm2_5,
        PollutantReduction.pm2_5);
  } else if (pollutantConstant == PollutantConstants.pm10.trim()) {
    return Pollutant(
        pollutantToString(PollutantConstants.pm10),
        PollutantDescription.pm10,
        PollutantSource.pm10,
        PollutantEffects.pm10,
        PollutantReduction.pm10);
  } else {
    return Pollutant(
        pollutantToString(PollutantConstants.pm2_5),
        PollutantDescription.pm2_5,
        PollutantSource.pm2_5,
        PollutantEffects.pm2_5,
        PollutantReduction.pm2_5);
  }
}
