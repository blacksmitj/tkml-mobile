import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TahapanProgram } from '@/types/tkml';
import { ColorPalette } from '@/constants/colors';
import { Check, Clock, AlertCircle } from 'lucide-react-native';

interface ProgressStepperProps {
  currentTahap: TahapanProgram;
}

interface StepItem {
  id: TahapanProgram;
  title: string;
  order: number;
}

const STEPS: StepItem[] = [
  { id: 'registrasi', title: 'Registrasi', order: 1 },
  { id: 'review_berkas', title: 'Review Berkas', order: 2 },
  { id: 'tahap_rab', title: 'Tahap RAB', order: 3 },
  { id: 'tahap_lpj', title: 'Tahap LPJ', order: 4 },
];

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentTahap }) => {
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentTahap);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tahapan Program TKML</Text>
      <View style={styles.stepsRow}>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Connector line */}
              {index > 0 && (
                <View
                  style={[
                    styles.connector,
                    index <= currentStepIndex ? styles.connectorActive : styles.connectorInactive,
                  ]}
                />
              )}

              {/* Step circle node */}
              <View style={styles.stepNode}>
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.circleCompleted,
                    isCurrent && styles.circleCurrent,
                    isPending && styles.circlePending,
                  ]}>
                  {isCompleted ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  ) : isCurrent ? (
                    <Clock size={14} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <Text style={styles.stepNumber}>{step.order}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepTitle,
                    isCurrent && styles.stepTitleCurrent,
                    isCompleted && styles.stepTitleCompleted,
                  ]}>
                  {step.title}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorPalette.slate[200],
    shadowColor: ColorPalette.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorPalette.slate[800],
    marginBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepNode: {
    alignItems: 'center',
    width: 68,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleCompleted: {
    backgroundColor: ColorPalette.emerald[500],
  },
  circleCurrent: {
    backgroundColor: ColorPalette.primary[600],
    shadowColor: ColorPalette.primary[700],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  circlePending: {
    backgroundColor: ColorPalette.slate[100],
    borderWidth: 1.5,
    borderColor: ColorPalette.slate[300],
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: ColorPalette.slate[500],
  },
  stepTitle: {
    fontSize: 11,
    textAlign: 'center',
    color: ColorPalette.slate[500],
    fontWeight: '500',
  },
  stepTitleCurrent: {
    color: ColorPalette.primary[700],
    fontWeight: '700',
  },
  stepTitleCompleted: {
    color: ColorPalette.slate[800],
    fontWeight: '600',
  },
  connector: {
    flex: 1,
    height: 2.5,
    marginTop: 15,
    marginHorizontal: -4,
  },
  connectorActive: {
    backgroundColor: ColorPalette.emerald[500],
  },
  connectorInactive: {
    backgroundColor: ColorPalette.slate[200],
  },
});
