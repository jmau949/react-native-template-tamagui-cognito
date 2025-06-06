import React from 'react'
import { Container, Card, Button, Heading1, BodyText } from '@/components'

export const HomeScreen: React.FC = () => {
  return (
    <Container centered>
      <Card>
        <Heading1>Acorn Pups Mobile</Heading1>
        <BodyText style={{ marginBottom: 20, textAlign: 'center' }}>
          Ready for development with Expo and Tamagui
        </BodyText>
        <Button 
          buttonVariant="primary"
          onPress={() => console.log('Ready to develop!')}
        >
          Start Building
        </Button>
      </Card>
    </Container>
  )
} 