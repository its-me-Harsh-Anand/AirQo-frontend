import 'package:app/providers/LocalProvider.dart';
import 'package:firebase_core/firebase_core.dart';
// import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'constants/app_constants.dart';
import 'languages/CustomLocalizations.dart';
import 'languages/lg_intl.dart';
import 'on_boarding/spash_screen.dart';
import 'providers/ThemeProvider.dart';
import 'themes/dark_theme.dart';
import 'themes/light_theme.dart';

Future<void> main() async {
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    // statusBarBrightness: Brightness.light,
    statusBarIconBrightness: Brightness.dark,
    systemNavigationBarDividerColor: ColorConstants.appBodyColor,
    systemNavigationBarColor: ColorConstants.appBodyColor,
    systemNavigationBarIconBrightness: Brightness.dark,
  ));

  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();

  // await Firebase.initializeApp().then((value) => {
  //       // FirebaseMessaging.onBackgroundMessage(backgroundMessageHandler),
  //
  //       FirebaseMessaging.onMessage
  //           .listen(FbNotifications().foregroundMessageHandler)
  //     });

  // await FirebaseAuth.instance.useAuthEmulator('localhost', 9099);

  final prefs = await SharedPreferences.getInstance();
  final themeController = ThemeController(prefs);

  runApp(AirQoApp(themeController: themeController));
}

class AirQoApp extends StatelessWidget {
  final ThemeController themeController;

  const AirQoApp({Key? key, required this.themeController}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: themeController,
      builder: (context, _) {
        return ThemeControllerProvider(
          controller: themeController,
          child: MultiProvider(
            providers: [
              ChangeNotifierProvider(create: (_) => LocaleProvider()),
            ],
            builder: (context, child) {
              final provider = Provider.of<LocaleProvider>(context);

              return MaterialApp(
                debugShowCheckedModeBanner: false,
                localizationsDelegates: [
                  CustomLocalizations.delegate,
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                  LgMaterialLocalizations.delegate,
                ],
                supportedLocales: [const Locale('en'), const Locale('lg')],
                locale: provider.locale,
                title: '${AppConfig.name}',
                theme: _buildCurrentTheme(),
                home: SplashScreen(),
              );
            },
          ),
        );
      },
    );
  }

  ThemeData _buildCurrentTheme() {
    switch (themeController.currentTheme) {
      case 'dark':
        return darkTheme();
      case 'light':
        return lightTheme();
      default:
        return lightTheme();
    }
  }
}
