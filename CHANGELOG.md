# Release Notes for Article Editor for Craft CMS

## v5.0.0 - 2024-11-13
- Added support for craft 5

## v3.1.1 - 2024-07-19

### Fixed
- Issue where the cp assets are causing a conflict with tabs in the admin

## v3.1.0 - 2024-03-11

### Fixed
- Issue where plugins weren't loaded

## v3.0.0 - 2024-02-28

> [!IMPORTANT]  
> Starting from this version, the plugin dependencies are only loaded in the CP. Please check your frontend!

### Fixed
- Issue where ArticleEditor volumes were not getting populated except for admin users
- Removes unnecessary jQuery dependency in favor of the default CpAsset
- Issue where the assets were also loaded in the frontend 

## v2.0.1 - 2022-05-17
- Fixing issue #15: In matrixfields the preview crashed sometimes

## v2.0.0 - 2022-05-04
- Compatible with CraftCMS 4

## v2.0.0-beta.1 - 2022-04-12
- Compatible with CraftCMS 4
- Still in BETA, so please report any issue(s) found!

## v1.1.1 - 2022-05-17
- Fixing issue #15: In matrixfields the preview crashed sometimes

## v1.1.0 - 2022-03-30

### Fixed
- Fixing issue #12: Preview Crashes

### Added
- Article Editor now uses version 2.4.1
- SOON: Support for CraftCMS 4

## v1.0.5 - 2021-10-08

### Fixed
- Fixing an issue when requesting the licenseKey for the CDN on IPv6 

## v1.0.4 - 2021-08-31

### Added
- Fixed incompatibility with Guzzle 6.x

## v1.0.3 - 2021-08-20

### Added
- Added `text`, `mediumtext` and `longtext` options to field settings (MySQL)

### Fixed
- Fixed incompatibility with PostgreSQL

## v1.0.2 - 2021-08-18

### Changed
- Updated icon to match Craft plugin store

## v1.0.1 - 2021-08-18

### Fixed
- Fixed error when rendering frames in the frontend

## v1.0.0 - 2021-08-17

- Initial release.
