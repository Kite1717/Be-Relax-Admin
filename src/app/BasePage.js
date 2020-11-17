import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { MeditationPage } from "./pages/MeditationPage";
import { ThemePage } from "./pages/ThemePage"
import { SleepPage } from "./pages/SleepPage"
import { MusicPage } from "./pages/MusicPage"

const GoogleMaterialPage = lazy(() =>
  import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
);
const ECommercePage = lazy(() =>
  import("./modules/ECommerce/pages/eCommercePage")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/meditation" />
        }
        <ContentRoute path="/meditation" component={MeditationPage} />
        <ContentRoute path="/theme" component={ThemePage} />
        <ContentRoute path="/sleep" component={SleepPage} />
        <ContentRoute path="/music" component={MusicPage} />
        {/* <Route path="/google-material" component={GoogleMaterialPage}/>
                <Route path="/react-bootstrap" component={ReactBootstrapPage}/>
                <Route path="/e-commerce" component={ECommercePage}/> */}
        {/*<Redirect to="error/error-v1" />*/}
      </Switch>
    </Suspense>
  );
}
