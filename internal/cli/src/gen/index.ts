#!/usr/bin/env node
import glob from 'fast-glob'
import fse from 'fs-extra'
import fsp from 'fs/promises'
import _ from 'lodash'
import path from 'path'
import { replaceInFile } from 'replace-in-file'
import { pkgsDirJoin } from '../utils'
import admob from './admob'
import capacitor from './capacitor'
import updateCliReadme from './cli'
import consent from './consent'
import cordovaNative from './cordova-native'
import rn from './rn'
import { indent4, warnMessage } from './shared'

async function copyCore() {
  const srcPathAndroid = pkgsDirJoin(
    'capacitor/android/src/main/java/admob/plus/core',
  )
  const srcPathIos = pkgsDirJoin('capacitor/ios/Plugin/AMBCore.swift')

  await Promise.all([
    fse.copy(srcPathAndroid, pkgsDirJoin('cordova/src/android/core')),
    fse.copy(srcPathIos, pkgsDirJoin('cordova/src/ios/AMBCore.swift')),
    fse.copy(
      srcPathAndroid,
      pkgsDirJoin('react-native/android/src/main/java/admob/plus/core'),
    ),
    // fse.copy(srcPathIos, pkgsDirJoin('react-native/ios/AMBCore.swift')),
  ])
}

async function updateConfigXML({
  pkgDir,
  targetDir,
}: {
  pkgDir: string
  targetDir: string
}) {
  const [androidFiles, androidResources, iosFiles, ioResources] =
    await Promise.all([
      glob(['**/*.java'], {
        cwd: path.join(pkgDir, 'src/android'),
      }),
      glob(['**/*.xml'], {
        cwd: path.join(pkgDir, 'src/android'),
      }),
      glob(['*.swift', '*.m'], {
        cwd: path.join(pkgDir, 'src/ios'),
      }),
      glob(['*.xib'], {
        cwd: path.join(pkgDir, 'src/ios'),
      }),
    ])
  const androidContent = androidFiles
    .map((s) => {
      const d = path.join(targetDir, path.dirname(s.toString()))
      return `${indent4(
        2,
      )}<source-file src="src/android/${s}" target-dir="${d}" />`
    })
    .concat(
      androidResources.map(
        (s) =>
          `${indent4(2)}<resource-file src="src/android/${s}" target="${s}" />`,
      ),
    )
    .sort()
    .join('\n')
  const iosContent = iosFiles
    .map((s) => `${indent4(2)}<source-file src="src/ios/${s}" />`)
    .concat(
      ioResources.map(
        (s) => `${indent4(2)}<resource-file src="src/ios/${s}" />`,
      ),
    )
    .sort()
    .join('\n')

  await replaceInFile({
    files: [path.join(pkgDir, 'plugin.xml')],
    from: /([\S\s]*ANDROID_BEGIN -->\n)[\S\s]*(\n\s+<!-- AUTOGENERATED: ANDROID_END[\S\s]*IOS_BEGIN -->\n)[\S\s]*(\n\s+<!-- AUTOGENERATED: IOS_END[\S\s]*)/,
    to: `$1${androidContent}$2${iosContent}$3`,
  })
}

const generateFiles = async () => {
  await copyCore()

  const specs = await Promise.all(
    [admob, capacitor, consent, cordovaNative, rn].map((f) => f()),
  )

  await Promise.all(
    _.flatMap(specs, ({ files }) => files).map((x) =>
      fsp.writeFile(pkgsDirJoin(x.path), x.f()),
    ),
  )

  await Promise.all(specs.filter((x) => x.targetDir).map(updateConfigXML))
}

const main = async () => {
  await Promise.all([updateCliReadme(), generateFiles()])
}

main()
