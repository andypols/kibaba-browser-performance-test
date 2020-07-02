export default class SystemCpuStats {
  async collect(totals, usage) {

    return {
      idlePct: (totals.idle / usage.length) * 100,
      kernelPct: (totals.kernel / usage.length) * 100,
      userPct: (totals.user / usage.length) * 100
    }
  }
}

