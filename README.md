# Gitpod provider credentials takeover

### Man in the middle attack to get credentials from git provaders

> click here to create a issue in this repository
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#/https://github.com/gerardo-junior/gitpod-provider-credentials-takeover.git)


#### what's the problem with that?

expose any user that opens a malicious repository on gitpod

getting this token depending on the release configuration level and it is possible to list, edit, delete any issue or organization

#### How this works?

extremely simple, only a proxy that intercepts and searches for basic authentication tokens on all requests

#### how to solve this?

I have two ideas:

##### 1° Affecting the ux

only a modal requesting authorization or even less to type password the git provaider


##### 2° transparent

the credential-helper gp generate or fetch a token via the supervisor's api and a proxy (outside of pod) translates that token into the git provider token (filtered by git agent)

![image](https://user-images.githubusercontent.com/9096410/113546674-d3878480-95c2-11eb-8838-1fc8c1a31b47.png)




