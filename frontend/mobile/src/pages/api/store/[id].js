import { StatusCodes } from 'http-status-codes';

import { reviewFetch } from '@/server/review/review';
import { storeFetch } from '@/server/store/store';

const handler = async (req, res) => {
  const { id } = req.query;
  const size = 10;
  const storeDetailInfo = {};
  await storeFetch.getStoreDetail(id).then(response => {
    storeDetailInfo.storeInfo = response.data;
  });
  await reviewFetch.getStoreReview(id, size).then(response => {
    storeDetailInfo.review = response.data;
  });
  await reviewFetch.getStoreTag(id).then(response => {
    // console.log(response.data);
    // response.data.map(tag => {
    //   console.log('dsadsadsads', tag);
    // });
    storeDetailInfo.tag = response.data;
  });
  res.status(StatusCodes.OK).json(storeDetailInfo);
};

export default handler;
