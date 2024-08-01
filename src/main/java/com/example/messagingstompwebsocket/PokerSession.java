package com.example.messagingstompwebsocket;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class PokerSession
{
    private final Map<String, String> voteByName = new ConcurrentHashMap<>();

    public Map<String, String> addPlayer(String name)
    {
        voteByName.put(name, "");
        return voteByName;
    }

    public Map<String, String> resetVotes()
    {
        voteByName.replaceAll((name, vote) -> "");
        return voteByName;
    }

    public Map<String, String> vote(String name, String vote)
    {
        voteByName.put(name, vote);
        return voteByName;
    }
}
