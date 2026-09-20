import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { cn } from "@/lib/utils";

export function IrShaderGradient({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient
          animate="on"
          axesHelper="off"
          bgColor1="#12344f"
          bgColor2="#0c1c2a"
          brightness={1.2}
          cAzimuthAngle={180}
          cDistance={2.4}
          cPolarAngle={95}
          cameraZoom={1}
          color1="#3a70a6"
          color2="#1b548d"
          color3="#143d67"
          destination="onCanvas"
          envPreset="city"
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={-2.1}
          positionZ={0}
          range="disabled"
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={225}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.8}
          uFrequency={5.5}
          uSpeed={0.2}
          uStrength={3}
          uTime={0.2}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
