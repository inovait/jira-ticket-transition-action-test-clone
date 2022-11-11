const action = require("./main")
const core = require('@actions/core');
const github = require('@actions/github');

let pullRequestRef = ""
if (github.context.payload.pull_request && github.context.payload.pull_request.head && github.context.payload.pull_request.head.ref) {
    pullRequestRef = github.context.payload.pull_request.head.ref
}
let before = github.context.payload.before
let after = github.context.payload.after
let commitTickets = action.extractCommits(after, before)
let ticketList = [...commitTickets, pullRequestRef, github.context.payload.ref]
console.log(JSON.stringify(ticketList))
