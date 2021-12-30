import path from 'path'
import {OutputOptions, rollup, watch} from 'rollup'
import {ChildProcess, spawn} from 'child_process'
import electron from 'electron'
import minimist from 'minimist'
import chalk from 'chalk'
import ora from 'ora'
import {getEnv, waitOn} from './utils'
import options from './rollup.config'
import {main} from '../package.json'

const env = getEnv()
const argv = minimist(process.argv.slice(2))
const opt = options({proc: 'main', env: argv.env})
const TAG = '[build-main.ts]'
const spinner = ora(`${TAG} Electron main build...`)

;(async () => {
    if (argv.watch) {
        // Wait on vite server launched
        await waitOn({port: env.PORT as string})

        const watcher = watch(opt)
        let child: ChildProcess
        watcher.on('change', filename => {
            const log = chalk.green(`change -- ${filename}`)
            console.log(TAG, log)
        })
        watcher.on('event', ev => {
            if (ev.code === 'END') {
                if (child) child.kill()
                child = spawn(
                    electron as unknown as string,
                    [path.join(__dirname, `../${main}`)],
                    {stdio: 'inherit'},
                )
            } else if (ev.code === 'ERROR') {
                console.log(ev.error)
            }
        })
    } else {
        spinner.start()
        try {
            const build = await rollup(opt)
            await build.write(opt.output as OutputOptions)
            spinner.succeed()
            process.exit()
        } catch (error) {
            console.log(`\n${TAG} ${chalk.red('Build Error')}\n`, error, '\n')
            spinner.fail()
            process.exit(1)
        }
    }
})();

