package com.example.messagingstompwebsocket;

import java.util.Map;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class PokerController
{
    private final PokerSession pokerSession;

    @MessageMapping("/add")
    @SendTo("/topic/pokersession")
    public Map<String, String> addPlayer(String name)
    {
        return pokerSession.addPlayer(name);
    }

    @MessageMapping("/reset")
    @SendTo("/topic/pokersession")
    public Map<String, String> resetVotes()
    {
        return pokerSession.resetVotes();
    }

    @MessageMapping("/vote")
    @SendTo("/topic/pokersession")
    public Map<String, String> vote(Vote vote)
    {
        return pokerSession.vote(vote.getName(), vote.getVote());
    }
}
