package com.tandamzi.noticeservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tandamzi.noticeservice.domain.Notice;
import com.tandamzi.noticeservice.dto.request.PickUpCompleteDto;
import com.tandamzi.noticeservice.feign.MemberServiceClient;
import com.tandamzi.noticeservice.repository.NoticeRepository;
import com.tandamzi.noticeservice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class KafkaConsumer {

    private final NoticeRepository noticeRepository;
    private final NoticeService noticeService;
    private final MemberServiceClient memberServiceClient;

    @KafkaListener(topics = "pickup-complete-order")
    public void pickUpCompleteOrder(String kafkaMessage){
        log.info("KafkaConsumer topics = pickup-complete-order, kafkaMessage = {}", kafkaMessage);

        Map<Object, Object> map = new HashMap<>();
        ObjectMapper mapper = new ObjectMapper();

        try{
            map = mapper.readValue(kafkaMessage, new TypeReference<Map<Object, Object>>() {});
        } catch (JsonProcessingException e){
            e.printStackTrace();
        }

        Long orderId =Long.valueOf((Integer)(map.get("orderId")));
        Long memberId = Long.valueOf((Integer)(map.get("memberId")));
        Long storeId =Long.valueOf((Integer)(map.get("storeId")));

        int quentity = (int) map.get("quentity");
        int totalSalesAmount = (int) map.get("totalSalesAmount");
        String storeName = (String) map.get("storeName");

        noticeRepository.save(
                Notice.builder()
                        .orderId(orderId)
                        .memberId(memberId)
                        .storeId(storeId)
                        .isRead(false)
                        .build()
        );

        List<Long> memberIds = new ArrayList<>();
        memberIds.add(memberId);
        List<String> tokens = memberServiceClient.getTokens(memberIds).getData();

        PickUpCompleteDto dto = PickUpCompleteDto.builder()
                .orderId(orderId)
                .memberId(memberId)
                .storeId(storeId)
                .storeName(storeName)
                .quentity(quentity)
                .totalSalesAmount(totalSalesAmount)
                .tokens(tokens)
                .build();

        noticeService.sendPickUpComplete(dto);

    }
}
