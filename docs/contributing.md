---
layout: page
---

![W3C Logo](https://www.w3.org/Icons/w3c_home)

_Based on the [EPUB testing methodology and code](#acknowledgements)._


# Writing tests for MiniApp

This repository contains tests to validate the implementations of the W3C's MiniApp specifications, specifically [MiniApp Packaging](https://www.w3.org/TR/miniapp-packaging/) (the spec for the MiniApp format itself), [MiniApp Manifest](https://www.w3.org/TR/miniapp-manifest/) (the spec to define a MiniApp and its configuration), and [MiniApp Lifecycle](https://www.w3.org/TR/miniapp-lifecycle/) (the spec that defines the events and APIs to control the execution lifecycle of a MiniApp). Our
objective is to test every normative statement (that is, every
[`MUST` or `SHOULD` or `MAY`](https://www.rfc-editor.org/info/bcp14), etc.). 

Existing tests are described in the [generated test reports](#generated-test-reports).

This page explains how to write new tests.

## Prerequisites

* Install any utility or local script that can turn an MiniApp folder into a ZIP-compressed MiniApp file (you can also use an `npm` script for that as mentioned in [debugging](#debugging)).
   
* Ensure you have several MiniApp user agents available to validate your tests (that is, validate that you have written the
  test correctly; many tests will nonetheless fail in individual reading systems).

TODO: List the MiniApp user agents.


## Step-by-step

1. Find an untested normative statement in the MiniApp specifications ([MiniApp Packaging](https://w3c.github.io/miniapp-packaging/), [MiniApp Manifest](https://w3c.github.io/TR/miniapp-manifest/), and [MiniApp Lifecycle](https://w3c.github.io/TR/miniapp-lifecycle/)) specs to test — that is, a statement that does not have an expandable "tests" section. (Note that these links point at the working drafts of the spec on GitHub, not the published versions on w3.org; the published spec hides the "tests" sections. In the published versions, you can still see whether a statement is tested by checking whether its anchor element has a `data-tests` attribute.)

1. Claim the normative statement by [creating an issue](https://github.com/w3c/miniapp-tests/issues/new) in the
   [w3c/miniapp-tests](https://github.com/w3c/miniapp-tests/) repo.

1. If you are an owner of [w3c/miniapp-tests](https://github.com/w3c/miniapp-tests/), create a branch on that repo for your new
   test. Otherwise, fork the repo and create a branch on your fork. (It's easier for reviewers to clone a PR to validate the
   test if it's in the original repo.)

1. Within the branch, copy the [test template](https://github.com/w3c/miniapp-tests/tree/main/tests/xx-miniapp-template). Name your copy as explained in [naming](#naming) below.

1. Modify the template as necessary to implement the test.

1. Describe the test by adding the [metadata](#metadata) documented below to the package document.

1. Once your test is complete, compress the full directory into an MiniApp ZIP file.

1. Open the MiniApp file in one or more MiniApp user agents to verify it behaves as expected. Fix as necessary.

1. Create a pull request for your test change, including both the uncompressed folder and the compressed MiniApp file. Please
   ensure the PR's description clearly indicates which statement is being tested. Await review.

1. Once the pull request has been merged, fork the repo for the spec you are testing (i.e., [MiniApp Packaging](https://w3c.github.io/miniapp-packaging/), [MiniApp Manifest](https://w3c.github.io/TR/miniapp-manifest/), or [MiniApp Lifecycle](https://w3c.github.io/TR/miniapp-lifecycle/)).

1. In the spec document, find the anchor element for the normative statement. If there is no anchor element, add one, using
   the same naming conventions as nearby anchors. Then add a `data-tests` attribute to the anchor element with the name(s) of
   your test(s) as comma-separated anchors:

   ```html
   <li data-tests="#pkg-filesystem-root-pages,#pkg-filesystem-root-common">The file system of a package MUST have a file structure based on a root directory....</li>
   ```

1. Create a pull request for your spec change and await review.


## Naming

Test names should start with a three-letter abbreviation that corresponds to the value of the [`dc:coverage`](#metadata)
element below (for example, `mnf` for Manifest, `pkg` for Packaging, etc.), followed by a short hyphenated
identifier that makes clear which requirement is under test. 

If multiple tests are necessary for a single normative statement, differentiate the test cases by appending an underscore and
a unique identifier. 

## Metadata

The root directory for each test must contain a `test.jsonld` file with the following metadata, which is used to
[generate test reports](#generated-test-reports):

* `dc:identifier`: A unique identifier for the test (unique across _all_ tests). This is typically the test’s directory name.
  It is used as an anchor in the reports, so its format must be suitable as an HTML fragment identifier.

* `dc:title`: The title of the test, in sentence case. It is used in the test description and should be as concise as
  possible.

* `dc:creator` (a list): Creator(s) of the tests.

* `dc:description`: A longer description of the test for the generated test report.

* `dc:coverage`: Which section of the report the test should be listed in. The report has a separate table for each section
   to make it more readable. The current list of sections is listed in a
   [JSON configuration file](https://github.com/w3c/miniapp-tests/blob/main/docs/drafts/config.json); if you add a new coverage
   value, edit that JSON file in the same pull request to add the new value under the `coverage_labels`. That list should
   reflect the order of the corresponding sections in the MiniApp specification.

* `dcterms:isReferencedBy` (a list): A series of URLs that refer to the relevant sections of
   the specification. These links provide back-links to the relevant normative statements from each test entry in the
   generated report.

* `dcterms:alternative` (optional): Overrides the value of `dc:title` in the generated test
  report. This should be used if the subject of the test is the value of `dc:title` itself (e.g., testing the base direction
  of the `title` element).

* `dcterms:conformsTo` (optional): The value is `must`, `should`, or `may`, and it specifies whether the test corresponds to a _MUST_ (or _MUST NOT_), _SHOULD_ (or _SHOULD NOT_), or _MAY_ (or _MAY NOT_) statement in the specification, respectively. If the metadata is not provided, or any other value is used, the default `must` value is used. 

* `dcterms:rights` as part of a `link` element: the rights associated with the test. Except for the rare cases the `href` attribute value should be set to `https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document` (i.e., to the W3C Software and Document Notice and License).

* `dcterms:rightsHolder` as part of a `link` element: the holder of the rights expressed by `dcterms:rights`. The `href` attribute value should be set to `https://www.w3.org/` in case the the rights value is set to the W3C Software and Document Notice and License, otherwise to a URL identifying the right holder.


Example of `test.jsonld` document:

```json
{
    "@context": {
      "dc": "http://purl.org/dc/elements/1.1/",
      "dcterms": "http://purl.org/dc/terms/",
      "foaf": "http://xmlns.com/foaf/0.1/",
      "earl": "http://www.w3.org/ns/earl#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "foaf:page": {
        "@type": "@id"
      }
    },
    "dcterms:rights": "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",
    "dcterms:rightsHolder": "https://www.w3.org",
    "@type": "earl:TestCase",
    "dc:coverage": "Manifest",
    "dc:creator": ["Jane Doe"],
    "dcterms:conformsTo": "must",
    "dc:date": "2022-07-08",
    "dc:title": "Fullscreen enabled in manifest",
    "dc:identifier": "mnf-window-fullscreen-true",
    "dc:description": "The window's fullscreen member is set to true in the manifest. The app must be shown in fullscreen.",
    "dcterms:isReferencedBy": [
      "https://www.w3.org/TR/miniapp-manifest/#dfn-process-the-window-s-fullscreen-member"
    ],
    "dcterms:modified": "2022-07-08T00:00:00Z"
}
```

(Note that, in this case, the `dcterms:conformsTo` property is not necessary, because that corresponds to the default value; it is only there as an example.)


## Implementation reports

The `reports` directory contains implementation reports in form of JSON files, one per reading system. The structure of the
JSON file is as follows:

* `name`: The name of the MiniApp vendor.

* `variant` (optional): The name of the MiniApp version variant. Typical values for super-app may be `Android,` `iOS`, or `Web`, if one
  implementation (i.e., sharing the same `name` value) has specific versions running in those environments.

* `ref` (optional): A URL that creates a link on the name of the MiniApp implementation in the implementation report.

* `tests`: An object with the implementation results. Each key is a test's unique identifier (its `dc:identifier`) with a
  values of `true`, `false`, or `null` for tests that pass, fail, or not tested, respectively. If a test is not listed, or its value is `null`, the implementation report will show a value of `N/A`, indicating that the implementation has not run the test.

Here is an example of a small test report:

```json
{
    "name": "ACME Mini Programs",
    "ref": "https://example.org/",
    "variant" : "iOS",
    "tests": {
        "cnt-css-scoped-support": true,
        "mnf-window-fullscreen-default": true,
        "mnf-window-fullscreen-true": false,
        "mnf-window-orientation-default": true,
        "mnf-window-orientation-landscape": true,
        "mnf-window-orientation-portrait": false,
        "pkg-pages-same-filenames": true,
        "pkg-root-app-css-empty": true        
    }
}
```

The template file in `reports/xx-template.json` should list all available test identifiers, with all values set, initially, to `null`.


## Generated test reports

When new tests are committed to the repo, a GitHub Actions workflow generates a report from the tests in the `tests`
directory and [implementation reports](#implementation-reports) in the `reports` directory.

The report consists of two HTML pages, namely:

* A [test suite description](https://w3c.github.io/miniapp-tests/) that lists each test, split into one table per unique
  `dc:coverage` value. Each table has one row per test, showing the test's ID, title, description, back-links to the relevant
  normative statements in the spec, and links to the implementation results.

* An [implementation report](https://w3c.github.io/miniapp-tests/results) that lists MiniApp implementations that have submitted test
  results along with their results tables. Each table has one row per test and one column per implementation, with cells
  indicating whether the test passed, failed, or has not been run.

## Debugging

If you want to create and debug your tests locally, you can do it using the `local_tests/` directory instead of `tests/`. These local tests won´t be added to the repository (it´s in the `.gitignore` document). You can create the documentation based on these local tests, just running the `debug` script using the command `npm run debug`. The script will generate the documentation using the content of `local_tests/`.

Read more about [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Generate .ma files

There is also another script that you can use to pack the unit tests you create. If you run `npm run add_metadata`, the script will add the `dcterms:rightsHolder` and `dcterms:rights` in every test description, if the metadata is not there. After that, the tests will be zipped into a `.ma` file with the same filename as the unit test directory you created. 

For instance, the test under `tests/cnt-css-global-support/` will generate the `tests/cnt-css-global-support.ma` MiniApp.

## Acknowledgements

This testing methodology is based on the [EPUB tests](https://w3c.github.io/epub-tests/), generated and maintained by the [EPUB 3 Working Group](https://www.w3.org/publishing/groups/epub-wg/). So, a big thanks to [Ivan Herman](https://www.w3.org/People/Ivan/), Dan Lazin, and the rest of [the group](https://www.w3.org/publishing/groups/epub-wg/).