---
layout: post.twig
title: Git tags and Github releases
subtitle: How to release software via Git and/or Github releases
description: How to release software via Git and/or Github releases
category: git
tags: 
  - Git
  - Github
  - release
  - zip
  - git-tag
  - git-archive
  - Github API
  - automation
---
Git comes with a `git tag` command that helps developers keep track of software versions. Git platform providers such as Github and Gitlab tie these tags to _releases_ by automatically creating archive packages, which is a great, basic minimal-effort distribution system for developers. 

Basically the _release_ feature on these platforms is a combination of `git tag`, `git archive` and a platform-specific step that allows further customization (such as a release title, extra assets).

## Using git tags as releases

There are a few ways you can go about releasing software on Github. The minimal and only fully platform-agnostic Git release is its automatic generation of `zip` and `tar` archives for any tag pushed to the repository. All you need to do is push a tag to the release branch:
```git
git tag -a "v1.0" -m "Project v1.0"\
git push origin master
```
This will result in a tag listing under the <kbd>Releases</kbd> tab in the <kbd>Code</kbd> tab of your Github repository, that has the same content as  the <kbd>Tags</kbd> tab right next to it.

![Github releases screenshot](https://i.imgur.com/2Smbyco.png)

The 2 tabs imply that indeed, a tag is not necessarily a release. A release (on Github and Gitlab at least) introduces the distinction between end-user audience vs fellow programmers, by means of a different lay-out and the ability to add additional info. 

## Creating Github releases

If you don't release often, you might be served well-enough by the [Github docs: "Creating releases"](https://help.github.com/articles/creating-releases/), which explains how to manually create a release for a git tag, and attach extra packages for download by end-users. This  latter feature is especially useful if merely downloading the tag's zip/tar archive requires a build step or includes files not of interest to end-users. 

Anyhow, what we're really interested in is making the Github release process part of the build workflow of the repository, without leaving the development environment. Luckily, as it turns out, Github has a releases API.

### Creating Github releases from the command-line

You can find all the API endpoints in the [Github Developer documentation for the Releases API](https://developer.github.com/v3/repos/releases/). The 2 of most interest to us are [Creating a release](https://developer.github.com/v3/repos/releases/#create-a-release) and [Uploading a release asset](https://developer.github.com/v3/repos/releases/#upload-a-release-asset). These are POST endpoints, so you need a personal Github access token first. Follow the steps outlined in the [Creating a personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) documentation first if you don't have any yet.

First, let's create a Github release. You need to send a JSON payload for which all the properties are pretty self-explanatory:
```json
{
  "tag_name": "v1.0",
  "target_commitish": "master",
  "name": "DemoSoft v1.0",
  "body": "Release DemoSoft v1.0 details",
  "draft": false,
  "prerelease": false
}
```
Store the JSON above in a file (e.g. gh-release.json), and the simple cURL call below will do the trick (if you replace the `<placeholders>` with a valid username, repository name and access token) :

```shell
curl -d @gh-release.json -X POST https://api.github.com/repos/<username>/<repo-name>/releases?access_token=<access_token>
```
Done! If you wish you can also attach assets to the release. Look up the `id` property of the success response of the previous call and copy it. Then execute
the cURL below (again, replacing the placeholders first).

```shell
curl -d @<path/to/asset.ext> -X POST https://api.github.com/repos/<username>/<repo-name>/releases/<id>/assets?name=<asset_filename>&label=<asset_label>&access_token=<access_token>
```

### Creating Github r


If your Git-versioned (and Github-published) project includes a build step with folders such as `src` and `dist`, chances are the end-users of your open-source contribution only need what's in `dist`, especially if it's not targeted for a package-managed (npm, composer, etc) environment and includes files like `.gitignore`, `readme.md`, or editor and build tool configs. 

### How to create a git tag or Github release that includes only a subfolder of your repository

Possible paths to keep those unneeded files out of the git tags/ Github release:
* If you do not care about the git commit history being attached to the release branch, `git checkout --orphan` is an option.
* If you don't mind a somewhat slow

 are
Ideally we'd have a git command have a branch that reflects the content of one subdirectory in our master branch. Creating a tag for a subfolder would be even better, but that is unfortunately not possible with Git.

There are a few possible options:
* `git subtree`
* `git checkout --orphan`
* `git worktree`

## git subtree
> Subtrees allow subprojects to be included within a subdirectory of the main project, optionally including the subproject’s entire history.

As you may notice `subtree`'s purpose is rather to include dependencies, but broadly the use-case of having a release branch still fits this description.
```shell
git subtree split -P dist -b release
```
This command will create a branch called _release_ that will only contain the files from the `dist` folder, and with a _detached copy of the git history applicable to the files in the dist folder_. Don't use the `--rejoin` parameter, this will result in a lot of bloat in the commit history (duplicate commits for both branches). 

Now, when we...
```shell
git checkout release
```
... we can create a git tag that will only apply to the subtree, and will only contain the items from the `dist` folder:
```shell
git tag -a "v1.0" -m "Project v1.0"
```
To publish the release on Github, simply push with the `--tags` option

```shell
git push --tags origin release
```
For subsequent releases we can simply add commits and update the subtree from our master/develop branch, by re-issueing the same command:
```shell
git subtree split -P dist -b release
``` 
This approach has the benefit that the commit history is still attached to the tag, however the command feels a bit awkward as opposed to simple merging eg, from develop to master. 

## git checkout --orphan

You can also create a new branch with a completely empty history, if you don't care that

Create a new `release` branch with the `--orphan` option:

```shell
git checkout --orphan release
```
This branch will have no HEAD 

Further reading:
* [Github | Creating releases](https://help.github.com/articles/creating-releases/)
* [Github | Releases API](https://developer.github.com/v3/repos/releases/)
* [NPM | github-release-cli](https://www.npmjs.com/package/github-release-cli)
* [NPM | gh-pages](https://www.npmjs.com/package/gh-pages)
* [Github | Creating a personal Github access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
* [Git Basics: Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
* [Stackoverflow: Git tag for a subfolder of a repository](https://stackoverflow.com/questions/12796735/git-tag-for-a-subfolder-of-a-repository)
* [Git release manager](https://gitreleasemanager.readthedocs.io/)