'use strict'

module.exports = async (msg, bot, n, service) => {
  if (n <= 0)
    n = 3

  for (let i, const data = service.listIds(); i < n; i++) {
    while (data[i = rand() % data.length] == "invalid") {}

    //

    data[i] = "invalid"
  }
}
