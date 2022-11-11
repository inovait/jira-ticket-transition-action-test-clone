const action = require("./main")
const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
  let pullRequestRef = ""
  if (github.context.payload.pull_request && github.context.payload.pull_request.head && github.context.payload.pull_request.head.ref) {
    pullRequestRef = github.context.payload.pull_request.head.ref
  }
  console.log(JSON.stringify(github.context))
  console.log(JSON.stringify(github.context.payload))
  let before = github.context.payload.before
  let after = github.context.payload.after
  let commitTickets = await action.extractCommits(after, before)
  let ticketList = [...commitTickets, pullRequestRef, github.context.payload.ref]
  console.log(JSON.stringify(ticketList))
}

run()