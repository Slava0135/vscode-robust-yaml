# Change Log

All notable changes to the "robust-yaml" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

## [Unreleased]

## [0.3.0] - 2024-02-01

* Color preview + color picker for strings in `"#rrggbb"` / `"#rrggbbaa"` format. (Issue #6)

## [0.2.1] - 2024-08-29

* Fixed C# datafields not being recognized if they are on same line. (Issue #18)
* Fixed datafields with generic types having "unknown" type. (Issue #16)

## [0.2.0] - 2024-07-4

* Added datafield summary and definition provider
* Added resource paths highlighting and definition provider

## [0.1.0] - 2024-06-22

* Added component fields autocompletion
* Fixed some issues when renaming/creating/deleting component files (but not directories, yet)

## [0.0.1] - 2024-04-12

* Initial release

### Added

* Limited entity and components support
  * Go to component definition
  * Show component summary when hovering over it
  * Component autocompletion
  * Highlighting of components
