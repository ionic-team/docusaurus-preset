/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Preset, LoadContext, PluginConfig, PluginOptions } from '@docusaurus/types';
import type { ThemeConfig, Options } from './preset-classic';

function makePluginConfig(source: string, options?: PluginOptions): string | [string, PluginOptions] {
  if (options) {
    return [require.resolve(source), options];
  }
  return require.resolve(source);
}

export default function preset(context: LoadContext, opts: Options = {}): Preset {
  const { siteConfig } = context;
  const { themeConfig } = siteConfig;
  const { algolia } = themeConfig as Partial<ThemeConfig>;
  const isProd = process.env.NODE_ENV === 'production';
  const { debug, docs, blog, pages, sitemap, theme, alias, ...rest } = opts;

  const themes: PluginConfig[] = [];
  themes.push(makePluginConfig('@ionic-internal/docusaurus-theme-classic-wrapper', theme));
  themes.push(makePluginConfig('@ionic-internal/docusaurus-theme'));
  if (algolia) {
    themes.push(require.resolve('@docusaurus/theme-search-algolia'));
  }

  const plugins: PluginConfig[] = [];

  plugins.push(makePluginConfig('@ionic-internal/docusaurus-plugin-tag-manager'));
  plugins.push(makePluginConfig('docusaurus-plugin-sass'));
  if (alias !== false) {
    plugins.push(makePluginConfig('docusaurus-plugin-module-alias', alias));
  }
  if (docs !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-docs', docs));
  }
  if (blog !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-blog', blog));
  }
  if (pages !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-content-pages', pages));
  }
  if (debug || (debug === undefined && !isProd)) {
    plugins.push(require.resolve('@docusaurus/plugin-debug'));
  }
  if (isProd && sitemap !== false) {
    plugins.push(makePluginConfig('@docusaurus/plugin-sitemap', sitemap));
  }
  if (Object.keys(rest).length > 0) {
    throw new Error(
      `Unrecognized keys ${Object.keys(rest).join(
        ', '
      )} found in preset-classic configuration. The allowed keys are debug, docs, blog, pages, sitemap, theme, googleAnalytics, gtag. Check the documentation: https://docusaurus.io/docs/presets#docusauruspreset-classic for more information on how to configure individual plugins.`
    );
  }

  return { themes, plugins };
}
