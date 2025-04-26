// app/emails/verification-email.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export const VerificationEmail = ({
  username,
  verificationLink,
}: {
  username: string;
  verificationLink: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Heading>Email Verification</Heading>
          <Section>
            <Text>Hi {username},</Text>
            <Text>
              Thanks for signing up! Please verify your email address to
              complete your registration.
            </Text>
            <Button
              href={verificationLink}
              style={{
                background: '#000',
                color: '#fff',
                padding: '12px 20px',
              }}
            >
              Verify Email
            </Button>
            <Text>Or copy and paste this link: {verificationLink}</Text>
            <Text>This link will expire in 24 hours.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
