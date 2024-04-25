import minimist from "minimist";
import _ from "lodash";



export async function run(options, ministOpts) {
  const argv = minimist(process.argv.slice(2), ministOpts);
  if (argv.debug) {
    console.log("argv of minist:", argv);
    console.log("process.argv:", process.argv);
  }
  if (argv.help) {
    console.log(Object.keys(options));
    return;
  }


  const subCmd = _.last(argv._);
  if (!subCmd) {
    throw new Error(
      `please specify a valid subcommand. and handler current is ${subCmd}`
    );
  }

  if (!options[subCmd]) {
    await options["default"].call(options, { value: subCmd });
    return;
  }
  await options[subCmd].call(options, _.omit(argv, ["_"]));
}
