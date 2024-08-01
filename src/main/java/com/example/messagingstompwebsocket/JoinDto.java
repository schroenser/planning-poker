package com.example.messagingstompwebsocket;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Jacksonized
@Builder
public class JoinDto
{
    String name;
}
