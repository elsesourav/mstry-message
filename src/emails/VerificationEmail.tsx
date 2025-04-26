import {
   Body,
   Font,
   Head,
   Heading,
   Html,
   Preview,
   Row,
   Section,
   Text,
} from "@react-email/components";

interface VerificationEmailProps {
   username: string;
   otp: string;
}

export default function VerificationEmail({
   username,
   otp,
}: VerificationEmailProps) {
   return (
      <Html lang="en" dir="ltr">
         <Head>
            <title>Verification Code</title>
            <Font
               fontFamily="Roboto"
               fallbackFontFamily="Verdana"
               webFont={{
                  url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                  format: "woff2",
               }}
               fontWeight={400}
               fontStyle="normal"
            />
         </Head>
         <Body
            style={{
               backgroundColor: "#f4f4f7",
               padding: "40px 0",
               fontFamily: "Roboto, Verdana, sans-serif",
            }}
         >
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section
               style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  backgroundColor: "#ffffff",
                  padding: "30px",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
               }}
            >
               <Row>
                  <Heading
                     as="h2"
                     style={{ marginBottom: "10px", color: "#333333" }}
                  >
                     Hello {username},
                  </Heading>
               </Row>
               <Row>
                  <Text
                     style={{
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#555555",
                        marginBottom: "20px",
                     }}
                  >
                     Thank you for registering with us! Please use the
                     verification code below to complete your registration:
                  </Text>
               </Row>
               <Row>
                  <Text
                     style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#2c3e50",
                        textAlign: "center",
                        backgroundColor: "#f0f4f8",
                        padding: "15px",
                        borderRadius: "6px",
                        letterSpacing: "2px",
                     }}
                  >
                     {otp}
                  </Text>
               </Row>
               <Row>
                  <Text
                     style={{
                        fontSize: "14px",
                        color: "#999999",
                        marginTop: "30px",
                        textAlign: "center",
                     }}
                  >
                     If you didn’t request this, you can safely ignore this
                     email.
                  </Text>
               </Row>
            </Section>
         </Body>
      </Html>
   );
}
