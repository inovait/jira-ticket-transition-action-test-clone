const simpleGit = require('simple-git')

function getTickets(input) {
    const ticketRegex = /([a-zA-Z][a-zA-Z0-9_]+-[1-9][0-9]*)/g
    let source = ""
    if (input != null) {
        if (input instanceof Array) {
            source = input.map((it) => {
                return it ? (it.message ? it.message : it) : ""
            })
            source = source.join(" ")
        } else {
            source = input.message
        }
    }
    let resMap = {}
    if (source != null) {
        let res = source.match(ticketRegex)
        if (res != null) {
            res.forEach((it) => {
                resMap[it] = ""
            })
        }
    }
    return Object.keys(resMap)
}

async function transitionTickets(tickets, sourceTransition, targetTransition, message, baseUrl, email, token) {
    var JiraApi = require('jira-client');
    var jira = new JiraApi({
        protocol: 'https',
        host: baseUrl,
        username: email,
        password: token,
        apiVersion: '2',
        strictSSL: true
    });

    let transitioned = []
    for (let ticket of tickets) {
        try {
            let issue = await jira.findIssue(ticket)
            if (sourceTransition && sourceTransition.toLowerCase() !== issue.fields.status.name.toLowerCase()) {
                console.log(`${ticket} is not in ${sourceTransition} status (${issue.fields.status.name}), skipping`)
            } else {
                let transitionId = await jira.listTransitions(ticket).then(res => {
                    return res.transitions.find((it) => it.name.toLowerCase() === targetTransition.toLowerCase()).id
                })
                if (issue.fields.status.name.toLowerCase() !== targetTransition.toLowerCase()) {
                    await jira.transitionIssue(ticket, { transition: transitionId })
                    transitioned.push(ticket)
                    if (message) {
                        await jira.addComment(ticket, message)
                    }
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return transitioned
}

async function extractCommits(after, before) {
  let options = {
    from: after,
    to: before
  }
  if (options.from === "0000000000000000000000000000000000000000") {
    delete options.from
  }
  if (options.to === "0000000000000000000000000000000000000000") {
    delete options.to
  }
  console.log(JSON.stringify(options))

  let res = await simpleGit().log(options)
  console.log(JSON.stringify(res, null, 2))
  return res.all
}

module.exports = {
    getTickets,
    transitionTickets,
    extractCommits
}