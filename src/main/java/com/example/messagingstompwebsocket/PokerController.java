package com.example.messagingstompwebsocket;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

@Controller
@RequiredArgsConstructor
public class PokerController
{
    private final LoadingCache<String, Map<String, String>> rooms = CacheBuilder.newBuilder()
        .expireAfterAccess(Duration.ofHours(1))
        .build(new CacheLoader<>()
        {
            public Map<String, String> load(String room)
            {
                return new ConcurrentHashMap<>();
            }
        });

    @MessageMapping("/{room}/join")
    @SendTo("/topic/{room}")
    @SneakyThrows
    public Map<String, String> join(@DestinationVariable String room, JoinDto body)
    {
        Map<String, String> valueByName = rooms.get(room);
        valueByName.put(body.getName(), "");
        return valueByName;
    }

    @MessageMapping("/{room}/reset")
    @SendTo("/topic/{room}")
    @SneakyThrows
    public Map<String, String> resetVotes(@DestinationVariable String room)
    {
        Map<String, String> valueByName = rooms.get(room);
        valueByName.replaceAll((name, vote) -> "");
        return valueByName;
    }

    @MessageMapping("/{room}/vote")
    @SendTo("/topic/{room}")
    @SneakyThrows
    public Map<String, String> vote(@DestinationVariable String room, VoteDto body)
    {
        Map<String, String> valueByName = rooms.get(room);
        valueByName.put(body.getName(), body.getValue());
        return valueByName;
    }
}
