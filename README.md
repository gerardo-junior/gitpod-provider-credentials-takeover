# Gitpod provider credentials takeover

### Man in the middle attack to get credentials from git provaders

> click here to create a issue in this repository
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#/https://github.com/gerardo-junior/gitpod-provider-credentials-takeover.git)


#### How this works?

extremely simple, only a proxy that intercepts and searches for basic authentication tokens on all requests

#### how to solve this?

I have two ideas:

##### 1° Affecting the ux

only a modal requesting authorization or even less to type password the git provaider


##### 2° transparent

the credential-helper gp generate or fetch a token via the supervisor's api and a proxy translates that token into the git provader token
