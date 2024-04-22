/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const productdetails = require('./lib/productdetails');

module.exports.productDetails = productdetails;
module.exports.contracts = [productdetails];
