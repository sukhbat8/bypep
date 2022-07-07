import { deleteRequest, getLists, getRequest, postRequest, preFilter } from "./AxiosService";

class PeatioApiService {
  baseUrl = "/api/v2/peatio";

  getDeposits = async (page, limit, filters) => {
    return await getLists(
      `${this.baseUrl}/admin/deposits?${preFilter(filters)}limit=${limit}&page=${page}&ordering=desc`
    );
  };

  getWithdrawals = async (page, limit, filters) => {
    return await getLists(
      `${this.baseUrl}/admin/withdraws?${preFilter(filters)}limit=${limit}&page=${page}&ordering=desc`
    );
  };

  getTrades = async (page, limit, uid) => {
    return await getLists(
      `${this.baseUrl}/admin/trades?limit=${limit}&page=${page}&uid=${uid}&ordering=desc`
    );
  };

  getOrders = async (page, limit, uid) => {
    return await getLists(
      `${this.baseUrl}/admin/orders?limit=${limit}&page=${page}&uid=${uid}&ordering=desc`
    );
  };

  getWithdraws = async (page, limit, uid) => {
    return await getLists(
      `${this.baseUrl}/admin/withdraws?limit=${limit}&page=${page}&uid=${uid}&ordering=desc`
    );
  };

  getUserInternalTransfers = async (page, limit, uid) => {
    return await getLists(
      `${this.baseUrl}/admin/internal_transfers_user?limit=${limit}&page=${page}&uid=${uid}&ordering=desc`
    );
  };

  getWithdrawDetail = async (id) => {
    return await getRequest(`${this.baseUrl}/admin/withdraws/${id}`);
  };

  getDepositDetail = async (tid) => {
    return await getRequest(`${this.baseUrl}/admin/deposits?tid=${tid}`);
  };

  setWithdrawAction = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/withdraws/actions`, body);
  }

  getMember = async (uid) => {
    return await getRequest(`${this.baseUrl}/admin/members/${uid}`);
  }
  getEnginesEdit = async (id) => {
    return await getRequest(`${this.baseUrl}/admin/engines/${id}`);
  }

  getInternalTransfer = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/internal_transfers?${preFilter(filters)}limit=${limit}&page=${page}&ordering=desc`)
  }
  getOpenOrder = async (page, limit, uid) => {
    return await getLists(`${this.baseUrl}/admin/orders?page=${page}&limit=${limit}&uid=${uid}&ordering=desc&state=wait`)
  }
  getOrdersHistory = async (limit, page, filters) => {
    return await getLists(`${this.baseUrl}/admin/orders?${preFilter(filters)}limit=${limit}&page=${page}&ordering=desc`)
  }
  getBeneficiaries = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/beneficiaries?${preFilter(filters)}page=${page}&limit=${limit}`)
  }
  getBeneficiary = async (id) => {
    return await getLists(`${this.baseUrl}/admin/beneficiaries?id=${id}`)
  }
  getEngines = async (page, limit) => {
    if(page && limit)
      return await getLists(`${this.baseUrl}/admin/engines?page=${page}&limit=${limit}&ordering=asc`)
    return await getLists(`${this.baseUrl}/admin/engines`)
  }
  getCurrencies = async (page, limit) => {
    if(page && limit)
      return await getLists(`${this.baseUrl}/admin/currencies?page=${page}&limit=${limit}&ordering=asc`)
    return await getLists(`${this.baseUrl}/admin/currencies`)

  }
  getCurrency_type = async (code) => {
    return await getLists(`${this.baseUrl}/admin/currencies?currency_type=${code}`)
  }
  getMarkets = async (page, limit) => {
    return await getLists(`${this.baseUrl}/admin/markets?page=${page}&limit=${limit}&ordering=asc`)
  }
  getMarket = async (market) => {
    return await getRequest(`${this.baseUrl}/admin/markets/${market}`)
  }
  getBlockchain = async (id) => {
    return await getRequest(`${this.baseUrl}/admin/blockchains/${id}`)
  }
  getAbility = async (body) => {
    return await getRequest(`${this.baseUrl}/admin/abilities`, body)
  }
  getCurrency = async (currency) => {
    return await getRequest(`${this.baseUrl}/admin/currencies/${currency}`)
  }
  getMarketOrderBook = async (page, limit, market, type) => {
    return await getLists(`${this.baseUrl}/admin/orders?page=${page}&limit=${limit}&market=${market}&state=wait&type=${type}&order_by=price&ordering=desc`)
  }
  getOpenOrderList = async (limit, page, filters) => {
    return await getLists(`${this.baseUrl}/admin/orders?${preFilter(filters)}limit=${limit}&page=${page}&state=wait&ordering=asc`)
  }
  getOrderSearch = async (page, limit) => {
    return await getLists(`${this.baseUrl}/admin/orders?page=${page}&limit=${limit}&ordering=desc&state=wait`)
  }
  getInternalTransfers = async (page, limit) => {
    return await getLists(`${this.baseUrl}/admin/internal_transfers?page=${page}&limit=${limit}&ordering=asc`)
  }
  postOrderCancel = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/orders/${body.id}/cancel`, body);
  }


  getBlockchains = async (page, limit) => {
    return await getLists(`${this.baseUrl}/admin/blockchains?page=${page}&limit=${limit}&ordering=desc`)
  }
  getBlockchainEdith = async () => {
    return await getLists(`${this.baseUrl}/admin/blockchains/clients`)
  }
  getBlock = async (id) => {
    if(id)
      return await getLists(`${this.baseUrl}/admin/blockchains/${id}/latest_block`)
    return await getRequest(`${this.baseUrl}/admin/blockchains`)
  }


  getWallets = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/wallets?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }
  getWallet= async (id) => {
    return await getRequest(`${this.baseUrl}/admin/wallets/${id}`)
  }
  getWalletKind= async (body) => {
    return await getRequest(`${this.baseUrl}/admin/wallets/kinds`, body)
  }
  getWalletGate= async (body) => {
    return await getRequest(`${this.baseUrl}/admin/wallets/gateways`, body)
  }
  getLinkedCurrency = async () => {
    return await getRequest(`${this.baseUrl}/admin/currencies`)
  }
  postWalletSelect = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/wallets/currencies`, body)
  }
  postWalletUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/wallets/update`, body);
  }
  postWalletNew = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/wallets/new`, body);
  }
  deleteWalletSelect = async (body) => {
    return await deleteRequest(`${this.baseUrl}/admin/wallets/currencies`, body)
  }


  getFeesSchedule = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/trading_fees?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }
  postFeesUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/trading_fees/update`, body);
  }
  postFeesNew = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/trading_fees/new`, body);
  }
  postFeesDelete = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/trading_fees/delete`, body)
  }


  getWithrawalLimits = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/withdraw_limits?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }
  getWithrawalGroups = async () => {
    return await getRequest(`${this.baseUrl}/admin/members/groups`)
  }
  postWithrawalNews = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/withdraw_limits`, body)
  }
  putWithrawalUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/withdraw_limits`, body);
  }
  deleteWithrawalDelete = async (id, body) => {
    return await deleteRequest(`${this.baseUrl}/admin/withdraw_limits/${id}`, body)
  }




  postBlockchainUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/blockchains/update`, body)
  }
  postBlockchainNew = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/blockchains/new`, body)
  }

  postEnginesUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/engines/update`, body);
  }
  postEnginesNew = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/engines/new`, body);
  }

  postCurrencyUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/currencies/update`, body);
  }
  postCurrenciesNew = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/currencies/new`, body);
  }

  postProcess_block = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/blockchains/process_block`, body);
  }

  postMarketUpdate = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/markets/update`, body);
  }
  postMarketNew = async (body) => {
    return await postRequest(`${this.baseUrl}/admin/markets/new`, body);
  }

  //Withdrawal pending 
  getWithrawalCoin = async (page, limit, filters, type, states) => {
    const stateFilter = states.map(x => `state[]=${x}`).join("&");
    return await getLists(`${this.baseUrl}/admin/withdraws?${preFilter(filters)}page=${page}&limit=${limit}&type=${type}&${stateFilter}&ordering=desc`)
  }
  getWithrawalCoinDetails = async (id, body) => {
    return await getLists(`${this.baseUrl}/admin/withdraws/${id}`, body);
  }
  getWithrawalMembers = async (uid) => {
    return await getRequest(`${this.baseUrl}/admin/members?uid=${uid}`);
  }
  getWithrawalHistorys = async (page, limit, uid) => {
    return await getRequest(`${this.baseUrl}/admin/withdraws?page=${page}&limit=${limit}&uid=${uid}`);
  }
  getWithrawalFiat = async (page, limit, filters, type, state) => {
    return await getLists(`${this.baseUrl}/admin/withdraws?${preFilter(filters)}page=${page}&limit=${limit}&state=${state}&type=${type}&ordering=desc`)
  }
  getCurrencys = async () => {
    return await getRequest(`${this.baseUrl}/admin/currencies`);
  }

  // Operations
  getOperations = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/assets?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }
  getOperationsLiabilities = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/liabilities?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }
  getOperationsRevenue = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/revenues?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }
  getOperationsExpenses = async (page, limit, filters) => {
    return await getLists(`${this.baseUrl}/admin/expenses?${preFilter(filters)}page=${page}&limit=${limit}&ordering=desc`)
  }

  // HODL
  getHodlPlanList = async () => {
    return await getRequest(`${this.baseUrl}/account/hodl/plans`);
  }
}

export default new PeatioApiService();