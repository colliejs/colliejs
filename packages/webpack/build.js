import { rollup } from "rollup";
import { loaderConfig } from "./rollup.config.js";

rollup(loaderConfig).then(bundle => {
  loaderConfig.output.forEach(e => {
    bundle.write(e);
  });
});
// rollup(pluginConfig).then(bundle => {
//   pluginConfig.output.forEach(e => {
//     bundle.write(e);
//   });
// });
