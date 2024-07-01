import minimist from "minimist";
import { last, omit } from "lodash-es";

export type Option = {
  [cmd: string]: (options: Record<string, string>) => Promise<any> | any;
};

export async function run(options: Option, ministOpts?: minimist.Opts) {
  const argv = minimist(process.argv.slice(2), ministOpts);
  if (argv.debug) {
    console.log("argv of minist:", argv);
    console.log("process.argv:", process.argv);
  }
  if (argv.help) {
    console.log(Object.keys(options));
    return;
  }
  if (argv.edit) {
    const sourceFile = process.argv[1];
    console.log(sourceFile);
    return;
  }

  const subCmd: string | undefined = last(argv._);
  if (!subCmd) {
    throw new Error(
      `please specify a valid subcommand. and handler current is ${subCmd}`
    );
  }

  if (!options[subCmd]) {
    await options["default"].call(options, { value: subCmd });
    return;
  }
  await options[subCmd].call(options, omit(argv, ["_"]));
}
